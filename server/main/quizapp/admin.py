from django.contrib import admin
from .models import Topic, DifficultyLevel, Question, Option, QuizSession, QuizSessionQuestion

# Register your models here.
admin.site.register(Topic)
admin.site.register(DifficultyLevel)
admin.site.register(Question)
admin.site.register(Option)
admin.site.register(QuizSession)
admin.site.register(QuizSessionQuestion)
