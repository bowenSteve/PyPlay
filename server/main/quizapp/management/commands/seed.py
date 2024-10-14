from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from quizapp.models import Topic, DifficultyLevel, Question, Option, QuizSession
from datetime import datetime

class Command(BaseCommand):
    help = 'Seed the database with initial data'

    def handle(self, *args, **kwargs):
        # Clear existing data
        self.clear_data()

        # Create Topics
        topics = ['Variables', 'Strings', 'Lists']
        topic_objects = []
        for topic_name in topics:
            topic, created = Topic.objects.get_or_create(name=topic_name)
            topic_objects.append(topic)
        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(topics)} topics'))

        # Create Difficulty Levels
        levels = ['Beginner', 'Intermediate', 'Pro']
        level_objects = []
        for level_name in levels:
            level, created = DifficultyLevel.objects.get_or_create(name=level_name)
            level_objects.append(level)
        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(levels)} difficulty levels'))

        # Create Questions and Options
        questions = [
            {
                'text': 'What is a variable in Python?',
                'difficulty': 'Beginner',
                'topics': ['Variables'],
                'timer': 60,
                'options': [
                    {'text': 'A reserved memory location to store values', 'is_correct': True},
                    {'text': 'A function in Python', 'is_correct': False},
                    {'text': 'A conditional statement', 'is_correct': False},
                ]
            },
            {
                'text': 'Which method can be used to convert a string to all uppercase?',
                'difficulty': 'Beginner',
                'topics': ['Strings'],
                'timer': 60,
                'options': [
                    {'text': 'upper()', 'is_correct': True},
                    {'text': 'capitalize()', 'is_correct': False},
                    {'text': 'lower()', 'is_correct': False},
                ]
            },
            {
                'text': 'How do you create a list in Python?',
                'difficulty': 'Beginner',
                'topics': ['Lists'],
                'timer': 60,
                'options': [
                    {'text': 'Using square brackets []', 'is_correct': True},
                    {'text': 'Using curly braces {}', 'is_correct': False},
                    {'text': 'Using parentheses ()', 'is_correct': False},
                ]
            },
        ]

        for q in questions:
            difficulty = DifficultyLevel.objects.get(name=q['difficulty'])
            question = Question.objects.create(
                text=q['text'],
                difficulty_level=difficulty,
                timer=q['timer']
            )
            # Add topics to the question
            for topic_name in q['topics']:
                topic = Topic.objects.get(name=topic_name)
                question.topics.add(topic)
            # Add options to the question
            for opt in q['options']:
                Option.objects.create(
                    question=question,
                    text=opt['text'],
                    is_correct=opt['is_correct']
                )
        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(questions)} questions'))

        # Create a sample user and quiz session
        user, created = User.objects.get_or_create(username='testuser', email='testuser@example.com')
        if created:
            user.set_password('password123')
            user.save()

        quiz_session = QuizSession.objects.create(
            user=user,
            selected_difficulty=DifficultyLevel.objects.get(name='Beginner'),
            start_time=datetime.now(),
            completed=False
        )
        quiz_session.selected_topics.add(*topic_objects)
        self.stdout.write(self.style.SUCCESS('Successfully created sample quiz session'))

    def clear_data(self):
        QuizSession.objects.all().delete()
        Option.objects.all().delete()
        Question.objects.all().delete()
        DifficultyLevel.objects.all().delete()
        Topic.objects.all().delete()
        self.stdout.write(self.style.WARNING('Cleared existing data'))
