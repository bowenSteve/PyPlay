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
        topics = ['Variables', 'Strings', 'Lists', 'Functions', 'Loops', 'Dictionaries', 'Classes', 'Files']
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
            {
                'text': 'What is a function in Python?',
                'difficulty': 'Beginner',
                'topics': ['Functions'],
                'timer': 60,
                'options': [
                    {'text': 'A block of reusable code', 'is_correct': True},
                    {'text': 'A data type', 'is_correct': False},
                    {'text': 'A loop', 'is_correct': False},
                ]
            },
            {
                'text': 'How do you define a function in Python?',
                'difficulty': 'Beginner',
                'topics': ['Functions'],
                'timer': 60,
                'options': [
                    {'text': 'Using the def keyword', 'is_correct': True},
                    {'text': 'Using the function keyword', 'is_correct': False},
                    {'text': 'Using the define keyword', 'is_correct': False},
                ]
            },
            {
                'text': 'What is the output of: print(2**3)?',
                'difficulty': 'Beginner',
                'topics': ['Variables'],
                'timer': 60,
                'options': [
                    {'text': '8', 'is_correct': True},
                    {'text': '6', 'is_correct': False},
                    {'text': '9', 'is_correct': False},
                ]
            },
            {
                'text': 'How do you create a dictionary in Python?',
                'difficulty': 'Beginner',
                'topics': ['Dictionaries'],
                'timer': 60,
                'options': [
                    {'text': 'Using curly braces {}', 'is_correct': True},
                    {'text': 'Using square brackets []', 'is_correct': False},
                    {'text': 'Using parentheses ()', 'is_correct': False},
                ]
            },
            {
                'text': 'How do you access a value in a dictionary?',
                'difficulty': 'Beginner',
                'topics': ['Dictionaries'],
                'timer': 60,
                'options': [
                    {'text': 'Using the key in square brackets', 'is_correct': True},
                    {'text': 'Using the index', 'is_correct': False},
                    {'text': 'Using a loop', 'is_correct': False},
                ]
            },
            {
                'text': 'What is the purpose of a loop in Python?',
                'difficulty': 'Beginner',
                'topics': ['Loops'],
                'timer': 60,
                'options': [
                    {'text': 'To iterate over a sequence of elements', 'is_correct': True},
                    {'text': 'To create a function', 'is_correct': False},
                    {'text': 'To declare a variable', 'is_correct': False},
                ]
            },
            {
                'text': 'Which of these is the correct syntax for a for loop in Python?',
                'difficulty': 'Beginner',
                'topics': ['Loops'],
                'timer': 60,
                'options': [
                    {'text': 'for i in range(10):', 'is_correct': True},
                    {'text': 'for(i=0; i<10; i++):', 'is_correct': False},
                    {'text': 'loop i in range(10):', 'is_correct': False},
                ]
            },
            {
                'text': 'How do you open a file for reading in Python?',
                'difficulty': 'Beginner',
                'topics': ['Files'],
                'timer': 60,
                'options': [
                    {'text': 'open("filename", "r")', 'is_correct': True},
                    {'text': 'open("filename")', 'is_correct': False},
                    {'text': 'file("filename", "r")', 'is_correct': False},
                ]
            },
            {
                'text': 'What is a class in Python?',
                'difficulty': 'Intermediate',
                'topics': ['Classes'],
                'timer': 60,
                'options': [
                    {'text': 'A blueprint for creating objects', 'is_correct': True},
                    {'text': 'A data type', 'is_correct': False},
                    {'text': 'A function', 'is_correct': False},
                ]
            },
            {
                'text': 'How do you create an instance of a class?',
                'difficulty': 'Intermediate',
                'topics': ['Classes'],
                'timer': 60,
                'options': [
                    {'text': 'object_name = ClassName()', 'is_correct': True},
                    {'text': 'object_name = class(ClassName)', 'is_correct': False},
                    {'text': 'object_name = new ClassName()', 'is_correct': False},
                ]
            },
            {
                'text': 'Which of the following is a mutable data type in Python?',
                'difficulty': 'Intermediate',
                'topics': ['Lists'],
                'timer': 60,
                'options': [
                    {'text': 'List', 'is_correct': True},
                    {'text': 'String', 'is_correct': False},
                    {'text': 'Tuple', 'is_correct': False},
                ]
            },
            {
                'text': 'Which of the following is an immutable data type in Python?',
                'difficulty': 'Intermediate',
                'topics': ['Strings'],
                'timer': 60,
                'options': [
                    {'text': 'String', 'is_correct': True},
                    {'text': 'List', 'is_correct': False},
                    {'text': 'Dictionary', 'is_correct': False},
                ]
            },
            {
                'text': 'What is the output of: print("Hello" * 3)?',
                'difficulty': 'Intermediate',
                'topics': ['Strings'],
                'timer': 60,
                'options': [
                    {'text': 'HelloHelloHello', 'is_correct': True},
                    {'text': 'Hello 3', 'is_correct': False},
                    {'text': 'Error', 'is_correct': False},
                ]
            },
            {
                'text': 'How do you create a tuple in Python?',
                'difficulty': 'Intermediate',
                'topics': ['Variables'],
                'timer': 60,
                'options': [
                    {'text': 'Using parentheses ()', 'is_correct': True},
                    {'text': 'Using square brackets []', 'is_correct': False},
                    {'text': 'Using curly braces {}', 'is_correct': False},
                ]
            },
            {
                'text': 'How do you create a comment in Python?',
                'difficulty': 'Beginner',
                'topics': ['Variables'],
                'timer': 60,
                'options': [
                    {'text': 'Using # at the beginning of the line', 'is_correct': True},
                    {'text': 'Using // at the beginning of the line', 'is_correct': False},
                    {'text': 'Using /* */', 'is_correct': False},
                ]
            },
            {
                'text': 'What does the break statement do in a loop?',
                'difficulty': 'Intermediate',
                'topics': ['Loops'],
                'timer': 60,
                'options': [
                    {'text': 'Exits the loop immediately', 'is_correct': True},
                    {'text': 'Skips to the next iteration', 'is_correct': False},
                    {'text': 'Repeats the current iteration', 'is_correct': False},
                ]
            },
            {
                'text': 'What is the output of: print(type(42))?',
                'difficulty': 'Intermediate',
                'topics': ['Variables'],
                'timer': 60,
                'options': [
                    {'text': "<class 'int'>", 'is_correct': True},
                    {'text': "<class 'str'>", 'is_correct': False},
                    {'text': "<class 'float'>", 'is_correct': False},
                ]
            },
            {
                'text': 'Which keyword is used to handle exceptions in Python?',
                'difficulty': 'Pro',
                'topics': ['Variables'],
                'timer': 60,
                'options': [
                    {'text': 'try', 'is_correct': True},
                    {'text': 'except', 'is_correct': False},
                    {'text': 'finally', 'is_correct': False},
                ]
            },
            {
                'text': 'How do you create a set in Python?',
                'difficulty': 'Intermediate',
                'topics': ['Variables'],
                'timer': 60,
                'options': [
                    {'text': 'Using curly braces {}', 'is_correct': True},
                    {'text': 'Using parentheses ()', 'is_correct': False},
                    {'text': 'Using square brackets []', 'is_correct': False},
                ]
            },
            {
                'text': 'How do you handle multiple exceptions in Python?',
                'difficulty': 'Pro',
                'topics': ['Variables'],
                'timer': 60,
                'options': [
                    {'text': 'Using multiple except blocks', 'is_correct': True},
                    {'text': 'Using if-else statements', 'is_correct': False},
                    {'text': 'Using multiple try blocks', 'is_correct': False},
                ]
            },
            {
                'text': 'Which method is used to add an item to a list in Python?',
                'difficulty': 'Beginner',
                'topics': ['Lists'],
                'timer': 60,
                'options': [
                    {'text': 'append()', 'is_correct': True},
                    {'text': 'insert()', 'is_correct': False},
                    {'text': 'add()', 'is_correct': False},
                ]
            },
            {
                'text': 'How do you remove an item from a list in Python?',
                'difficulty': 'Beginner',
                'topics': ['Lists'],
                'timer': 60,
                'options': [
                    {'text': 'remove()', 'is_correct': True},
                    {'text': 'delete()', 'is_correct': False},
                    {'text': 'pop()', 'is_correct': False},
                ]
            },
            {
                'text': 'What is the correct syntax to create a generator in Python?',
                'difficulty': 'Pro',
                'topics': ['Functions'],
                'timer': 60,
                'options': [
                    {'text': 'Using yield in a function', 'is_correct': True},
                    {'text': 'Using return in a function', 'is_correct': False},
                    {'text': 'Using a list comprehension', 'is_correct': False},
                ]
            },
            {
                'text': 'Which Python function is used to get the length of a list?',
                'difficulty': 'Beginner',
                'topics': ['Lists'],
                'timer': 60,
                'options': [
                    {'text': 'len()', 'is_correct': True},
                    {'text': 'size()', 'is_correct': False},
                    {'text': 'length()', 'is_correct': False},
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
