from django.http import HttpResponseServerError
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers, status
from raterapi.models import Game, Category

class GameView(ViewSet): 
    def list(self, request):
    # Get query string parameter
        owner_only = self.request.query_params.get("owner", None)

        try:
            # Start with all rows
            games = Game.objects.all()

            # If `?owner=current` is in the URL
            if owner_only is not None and owner_only == "current":
                # Filter to only the current user's rocks
                games = games.filter(user=request.auth.user)

            serializer = GameSerializer(games, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as ex:
            return HttpResponseServerError(ex)
        
    def retrieve(self, request, pk=None):
        try:
            book = Game.objects.get(pk=pk)
            serializer = GameSerializer(book, context={'request': request})
            return Response(serializer.data)

        except Game.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        """Handle POST requests for creating a new game"""
        game = Game()
        game.title = request.data['title']
        game.description = request.data['description']
        game.designer = request.data['designer']
        game.year_released = request.data['year_released']
        game.number_of_players = request.data['number_of_players']
        game.estimated_time = request.data['estimated_time']
        game.age_recommendation = request.data['age_recommendation']
        game.created_by = self.request.user
        game.save()

        # Handle the many-to-many categories
        for category_id in request.data['categories']:
            category = Category.objects.get(id=category_id)
            game.categories.add(category)

        game.save()
        serialized = GameSerializer(game, many=False)

        return Response(serialized.data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        try:

            game = Game.objects.get(pk=pk)

            # Is the authenticated user allowed to edit this book?
            self.check_object_permissions(request, game)

            serializer = GameSerializer(data=request.data)
            if serializer.is_valid():
                game.title = serializer.validated_data['title']
                game.description = serializer.validated_data['description']
                game.designer = serializer.validated_data['designer']
                game.year_released = serializer.validated_data['year_released']
                game.number_of_players = serializer.validated_data['number_of_players']
                game.estimated_time = serializer.validated_data['estimated_time']
                game.age_recommendation = serializer.validated_data['age_recommendation']
                game.created_by = self.request.user
                game.save()


                if 'categories' in request.data:
                # Clear existing categories
                    game.categories.clear()
                    
                    # Extract category IDs if full category objects are provided
                    category_ids = [category['id'] for category in request.data['categories']]
                    
                    # Add new categories
                    for category_id in category_ids:
                        try:
                            category = Category.objects.get(id=category_id)
                            game.categories.add(category)
                        except Category.DoesNotExist:
                            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": f"Category with ID {category_id} does not exist."})
                
                game.save()

                serializer = GameSerializer(game, context={'request': request})
                return Response(None, status.HTTP_204_NO_CONTENT)

            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

        except Game.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        
class GameCategorySerializer(serializers.ModelSerializer):
    """JSON serializer"""

    class Meta:
        model = Category
        fields = ( 'id', 'title', )
        
class GameSerializer(serializers.ModelSerializer): 

    categories = GameCategorySerializer(many=True)

    class Meta:
        model = Game
        fields = ( 'id', 'title', 'description', 'designer', 'year_released', 'number_of_players', 'estimated_time', 'age_recommendation','created_by', 'categories' )
        