from django.db import models
from django.contrib.auth.models import User



class PlayerImage(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey("Game", on_delete=models.CASCADE)
    img_url = models.URLField()

    def __str__(self):
        return f"Image for {self.player.username} on {self.game.title}"



