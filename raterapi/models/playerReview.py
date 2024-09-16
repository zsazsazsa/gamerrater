from django.db import models
from django.contrib.auth.models import User



class PlayerReview(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey("Game", on_delete=models.CASCADE)
    review = models.TextField()

    def __str__(self):
        return f"Review by {self.player.username} for {self.game.title}"
