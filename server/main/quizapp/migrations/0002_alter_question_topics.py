# Generated by Django 4.2.16 on 2024-10-15 08:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quizapp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='topics',
            field=models.ManyToManyField(related_name='questions', to='quizapp.topic'),
        ),
    ]
