from django.shortcuts import render
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Question, Topic
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework import serializers




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
    question_list = QuestionSerializer(questions, many=True).data

    return Response({"Questions":question_list},status=status.HTTP_200_OK )
