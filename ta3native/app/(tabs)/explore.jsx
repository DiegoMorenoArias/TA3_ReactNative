import { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, Image, ActivityIndicator } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMovie = async () => {
    setLoading(true);
    setError('');
    setMovieData(null);
    
    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=effa0341&t=${movieTitle}`);
      const data = await response.json();
      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        setError('No se encontró la peli, buscá de vuelta.');
      }
    } catch (err) {
      setError('Opa, ocurrió un error. Intentá de nuevo después.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<ThemedText type="title">Explore Movies</ThemedText>}>
      
      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Poné el nombre de la peli..."
          value={movieTitle}
          onChangeText={setMovieTitle}
        />
        <Button title="Search" onPress={fetchMovie} />
      </ThemedView>
      
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        movieData && (
          <View style={styles.movieContainer}>
            <Image source={{ uri: movieData.Poster }} style={styles.poster} />
            <Text style={styles.title}>{movieData.Title}</Text>
            <Text style={styles.plot}>{movieData.Plot}</Text>
          </View>
        )
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
  },
  movieContainer: {
    padding: 16,
    alignItems: 'center',
  },
  poster: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  plot: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
});
