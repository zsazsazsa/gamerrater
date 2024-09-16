from django.db import models

class Game(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    designer = models.CharField(max_length=255)
    year_released = models.IntegerField()
    number_of_players = models.IntegerField()
    estimated_time = models.IntegerField(help_text="Estimated playtime in minutes")
    age_recommendation = models.IntegerField()
    categories = models.ManyToManyField(
        "Category",
        through='GameCategory',
        related_name="games"
    )

    def __str__(self):
        return self.title

