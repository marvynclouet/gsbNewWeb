import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const Recommendations = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // TODO: Implémenter l'appel API pour obtenir les recommandations
        const mockRecommendations = [
          {
            id: 1,
            name: 'Paracétamol',
            description: 'Antidouleur et antipyrétique',
            price: '5.99€',
            image: '/images/paracetamol.jpg'
          },
          {
            id: 2,
            name: 'Vitamine C',
            description: 'Complément alimentaire',
            price: '12.99€',
            image: '/images/vitamine-c.jpg'
          }
        ];
        setRecommendations(mockRecommendations);
      } catch (error) {
        console.error('Erreur lors de la récupération des recommandations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  if (loading) {
    return <Typography>Chargement des recommandations...</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Recommandations pour vous
      </Typography>
      <Grid container spacing={3}>
        {recommendations.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography color="textSecondary" gutterBottom>
                  {product.description}
                </Typography>
                <Typography variant="body2" color="primary">
                  {product.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Recommendations; 