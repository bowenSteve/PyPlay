from django.db import models
from django.contrib.auth.models import User

class Topic(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class DifficultyLevel(models.Model):
    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Pro', 'Pro'),
    ]
    name = models.CharField(max_length=20, choices=LEVEL_CHOICES, unique=True)

    def __str__(self):
        return self.name

class Question(models.Model):
    text = models.TextField()
    topics = models.ManyToManyField(Topic, related_name='questions')
    difficulty_level = models.ForeignKey(DifficultyLevel, on_delete=models.CASCADE)
    timer = models.IntegerField(help_text='Time allowed in seconds')

    def __str__(self):
        return self.text

class Option(models.Model):
    question = models.ForeignKey(Question, related_name='options', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text

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

class Score(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz_session = models.ForeignKey(QuizSession, on_delete=models.CASCADE)
    total_score = models.IntegerField(default=0)
    correct_answers = models.ManyToManyField(Question, related_name='correct_scores', blank=True)
    wrong_answers = models.ManyToManyField(Question, related_name='wrong_scores', blank=True)
    time_taken = models.DurationField(null=True, blank=True)  # Total time taken for the quiz

    def __str__(self):
        return f"Score for {self.user.username} in session {self.quiz_session.id}: {self.total_score}"


