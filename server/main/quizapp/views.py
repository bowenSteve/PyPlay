from django.shortcuts import render
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Question, Topic, Option, DifficultyLevel, QuizSession, Score
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework import serializers
from .serializers import QuestionSerializer, OptionSerializer  
from datetime import timedelta




class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'difficulty_level', 'timer', 'topics']

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensure access token is valid
def logout_view(request):
    try:
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({"error": "Refresh token is missing"}, status=status.HTTP_400_BAD_REQUEST)

        print(f"Received refresh token: {refresh_token}")  # Log the received refresh token
        token = RefreshToken(refresh_token)
        token.blacklist()  # Blacklist the refresh token

        return Response(status=status.HTTP_205_RESET_CONTENT)  # Return 205 Reset Content
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_questions(request):
    questions = Question.objects.all().values()
    question_list = list(questions)

    return Response({"Questions":question_list},status=status.HTTP_200_OK )

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure that only authenticated users can access this route
def get_user_details(request):
    # Get the currently authenticated user
    user = request.user
    
    # If the user is authenticated, return their details
    if user:
        user_data = {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        }
        return Response(user_data, status=status.HTTP_200_OK)
    
    return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_topics(request):
    topics = Topic.objects.all().values()
    topic_list = list(topics)

    return Response({"Topics":topic_list}, status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_topics_id(request, id):
    topic = Topic.objects.filter(id=id).first()
    if not topic:
        return Response({"error": "Topic not found"}, status=status.HTTP_404_NOT_FOUND)

    questions = Question.objects.filter(topics=topic)
    question_list = []

    for question in questions:
        options = Option.objects.filter(question=question)
        options_data = OptionSerializer(options, many=True).data  # Serialize the options
        question_data = QuestionSerializer(question).data  # Serialize the question
        question_data['options'] = options_data  # Add options to the question data
        question_list.append(question_data)

    return Response({"Questions": question_list}, status=status.HTTP_200_OK)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_quiz_session(request):
    data = request.data
    topic_id = data.get('topic_ids')  # Expect a single topic ID
    difficulty_level_name = data.get('difficulty_level')

    # Retrieve the authenticated user from the JWT token
    user = request.user

    # Validate required fields
    if not difficulty_level_name:
        return Response({"error": "Missing difficulty level"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Find the selected difficulty level
        selected_difficulty = DifficultyLevel.objects.get(name=difficulty_level_name)

        # Create the quiz session for the authenticated user
        quiz_session = QuizSession.objects.create(
            user=user,
            selected_difficulty=selected_difficulty
        )

        # Add the selected topic
        topic = Topic.objects.filter(id=topic_id).first()  # Get the single topic

        if not topic:
            return Response({"error": "Invalid topic"}, status=status.HTTP_400_BAD_REQUEST)

        # Set the selected topic
        quiz_session.selected_topics.set([topic])  # Use a list to set the single topic
        quiz_session.save()

        return Response({"message": "Quiz session created", "session_id": quiz_session.id}, status=status.HTTP_201_CREATED)

    except DifficultyLevel.DoesNotExist:
        return Response({"error": "Invalid difficulty level"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_score(request):
    data = request.data
    
    # Validate required fields
    quiz_session_id = data.get('quiz_session_id')
    total_score = data.get('total_score')
    correct_answers_ids = data.get('correct_answers', [])
    wrong_answers_ids = data.get('wrong_answers', [])
    time_taken_str = data.get('time_taken')  # Time in string format (e.g., "60 seconds")

    if quiz_session_id is None or total_score is None:
        return Response({"error": "Missing required fields: quiz_session_id and total_score"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Convert time_taken string to timedelta
        time_taken_parts = time_taken_str.split()
        time_taken_seconds = int(time_taken_parts[0])  # Get the number of seconds as an int
        time_taken = timedelta(seconds=time_taken_seconds)

        # Retrieve the QuizSession instance
        quiz_session = QuizSession.objects.get(id=quiz_session_id, user=request.user)

        # Create the Score instance
        score = Score.objects.create(
            user=request.user,
            quiz_session=quiz_session,
            total_score=total_score,
            time_taken=time_taken
        )

        # Add correct and wrong answers
        if correct_answers_ids:
            correct_questions = Question.objects.filter(id__in=correct_answers_ids)
            score.correct_answers.set(correct_questions)

        if wrong_answers_ids:
            wrong_questions = Question.objects.filter(id__in=wrong_answers_ids)
            score.wrong_answers.set(wrong_questions)

        score.save()

        return Response({"message": "Score created successfully", "score_id": score.id}, status=status.HTTP_201_CREATED)

    except QuizSession.DoesNotExist:
        return Response({"error": "Quiz session not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_scores(request):
    scores = Score.objects.filter(user=request.user).select_related('quiz_session')
    scores_data = [
        {
            "id": score.id,
            "quiz_session": {
                "id": score.quiz_session.id,
            },
            "total_score": score.total_score,
            "time_taken": score.time_taken.total_seconds() if score.time_taken else 0,  # Handle None for time_taken
            "correct_answers": list(score.correct_answers.values()),  # Extracting correct answers
            "wrong_answers": list(score.wrong_answers.values()),
        }
        for score in scores
    ]

    return Response({"scores": scores_data}, status=status.HTTP_200_OK)
