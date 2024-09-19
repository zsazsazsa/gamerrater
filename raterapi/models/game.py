from django.db import models
from django.contrib.auth.models import User

class Game(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    designer = models.CharField(max_length=255)
    year_released = models.IntegerField()
    number_of_players = models.IntegerField()
    estimated_time = models.IntegerField(help_text="Estimated playtime in minutes")
    age_recommendation = models.IntegerField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    categories = models.ManyToManyField(
        "Category",
        through='GameCategory',
        related_name="games"
    )

    def __str__(self):
        return self.title

