import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Slider,
  Button,
  Grid,
  Box,
} from '@mui/material';

const MovimientoParabolico = () => {
  const [velocidadInicial, setVelocidadInicial] = useState(50);
  const [angulo, setAngulo] = useState(45);
  const [tiempo, setTiempo] = useState(0);
  const [animando, setAnimando] = useState(false);

  // Constantes físicas
  const g = 9.81; // m/s²
  const escala = 2; // Factor de escala para la visualización

  // Cálculos de la trayectoria
  const velocidadX = velocidadInicial * Math.cos((angulo * Math.PI) / 180);
  const velocidadY = velocidadInicial * Math.sin((angulo * Math.PI) / 180);

  // Tiempo total de vuelo
  const tiempoTotal = (2 * velocidadY) / g;

  // Alcance máximo
  const alcanceMax = (velocidadInicial ** 2 * Math.sin((2 * angulo * Math.PI) / 180)) / g;

  // Altura máxima
  const alturaMax = (velocidadY ** 2) / (2 * g);

  // Posición actual del proyectil
  const x = velocidadX * tiempo;
  const y = velocidadY * tiempo - 0.5 * g * tiempo ** 2;

  // Convertir coordenadas a pixels para SVG
  const svgX = (x / alcanceMax) * 300 + 50;
  const svgY = 250 - (y / alturaMax) * 200;

  useEffect(() => {
    let intervalId;
    if (animando) {
      intervalId = setInterval(() => {
        setTiempo((t) => {
          if (t >= tiempoTotal) {
            setAnimando(false);
            return 0;
          }
          return t + 0.05;
        });
      }, 50);
    }
    return () => clearInterval(intervalId);
  }, [animando, tiempoTotal]);

  // Generar puntos para la trayectoria completa
  const generarPuntos = () => {
    const puntos = [];
    for (let t = 0; t <= tiempoTotal; t += tiempoTotal / 50) {
      const px = (velocidadX * t / alcanceMax) * 300 + 50;
      const py = 250 - ((velocidadY * t - 0.5 * g * t ** 2) / alturaMax) * 200;
      puntos.push(`${px},${py}`);
    }
    return puntos.join(' ');
  };

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <CardHeader title="Simulador de Movimiento Parabólico" />
      <CardContent>
        <Box mb={4}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <Typography gutterBottom>Velocidad Inicial: {velocidadInicial} m/s</Typography>
              <Slider
                value={velocidadInicial}
                onChange={(e, v) => setVelocidadInicial(v)}
                min={10}
                max={100}
                step={1}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>Ángulo: {angulo}°</Typography>
              <Slider
                value={angulo}
                onChange={(e, v) => setAngulo(v)}
                min={0}
                max={90}
                step={1}
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </Box>

        <Box>
          <svg viewBox="0 0 400 300" style={{ border: '1px solid #ccc', borderRadius: '4px', background: '#f5f5f5' }}>
            {/* Ejes */}
            <line x1="50" y1="250" x2="350" y2="250" stroke="black" strokeWidth="2" />
            <line x1="50" y1="250" x2="50" y2="50" stroke="black" strokeWidth="2" />

            {/* Flechas de los ejes */}
            <polygon points="345,245 345,255 360,250" fill="black" />
            <polygon points="45,55 55,55 50,40" fill="black" />

            {/* Etiquetas */}
            <text x="355" y="265" fontSize="14">x</text>
            <text x="35" y="45" fontSize="14">y</text>

            {/* Trayectoria */}
            <polyline
              points={generarPuntos()}
              fill="none"
              stroke="gray"
              strokeWidth="1"
              strokeDasharray="5,5"
            />

            {/* Proyectil */}
            <circle cx={svgX} cy={svgY} r="6" fill="red" />

            {/* Vectores */}
            <line
              x1={svgX}
              y1={svgY}
              x2={svgX + velocidadX * escala}
              y2={svgY - velocidadY * escala + g * tiempo * escala}
              stroke="blue"
              strokeWidth="2"
            />
          </svg>
        </Box>

        <Grid container spacing={2} mt={4} justifyContent="space-between">
          <Grid item>
            <Typography>Alcance máximo: {alcanceMax.toFixed(1)} m</Typography>
            <Typography>Altura máxima: {alturaMax.toFixed(1)} m</Typography>
            <Typography>Tiempo total: {tiempoTotal.toFixed(1)} s</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setTiempo(0);
                setAnimando(!animando);
              }}
            >
              {animando ? 'Detener' : 'Iniciar'}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MovimientoParabolico;