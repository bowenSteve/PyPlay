from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User

class Topic(models.Model):
    name = models.CharField(max_length=255)

class DifficultyLevel(models.Model):
    LEVEL_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]
    name = models.CharField(max_length=20, choices=LEVEL_CHOICES, unique=True)
    question_text = models.CharField(max_length=255)
    choice_a = models.CharField(max_length=100)
    choice_b = models.CharField(max_length=100)
    choice_c = models.CharField(max_length=100)
    choice_d = models.CharField(max_length=100)
    correct_answer = models.CharField(max_length=1)  # 'a', 'b', 'c', or 'd'
    level = models.CharField(max_length=6, choices=LEVEL_CHOICES)

    def __str__(self):
        return self.question_text

class Question(models.Model):
    text = models.TextField()
    topics = models.ManyToManyField(Topic)
    difficulty_level = models.ForeignKey(DifficultyLevel, on_delete=models.CASCADE)
    timer = models.IntegerField(help_text='Time allowed in seconds')

class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

class QuizSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    selected_topics = models.ManyToManyField(Topic)
    selected_difficulty = models.ForeignKey(DifficultyLevel, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    completed = models.BooleanField(default=False)

class QuizSessionQuestion(models.Model):
    quiz_session = models.ForeignKey(QuizSession, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    order = models.IntegerField()
    time_started = models.DateTimeField()
    time_ended = models.DateTimeField(null=True, blank=True)
    time_taken = models.DurationField(null=True, blank=True)
    user_answer = models.ForeignKey(Option, null=True, blank=True, on_delete=models.SET_NULL)
    correct = models.BooleanField(default=False)
