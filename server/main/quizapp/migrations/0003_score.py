# Generated by Django 4.2.16 on 2024-10-17 05:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('quizapp', '0002_alter_question_topics'),
    ]

    operations = [
        migrations.CreateModel(
            name='Score',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_score', models.IntegerField(default=0)),
                ('time_taken', models.DurationField(blank=True, null=True)),
                ('correct_answers', models.ManyToManyField(blank=True, related_name='correct_scores', to='quizapp.question')),
                ('quiz_session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='quizapp.quizsession')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('wrong_answers', models.ManyToManyField(blank=True, related_name='wrong_scores', to='quizapp.question')),
            ],
        ),
    ]
