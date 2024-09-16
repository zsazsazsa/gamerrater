from django.db import models
from django.contrib.auth.models import User



class PlayerRating(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey("Game", on_delete=models.CASCADE)
    rating = models.IntegerField()

    def __str__(self):
        return f"Rating {self.rating} by {self.player.username} for {self.game.title}"


