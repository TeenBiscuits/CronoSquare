<!--
SPDX-FileCopyrightText: 2024 Pablo Portas López <81629707+TeenBiscuits@users.noreply.github.com>

SPDX-License-Identifier: Apache-2.0
-->

[![CronoSquare Logo](https://raw.githubusercontent.com/TeenBiscuits/CronoSquare/main/imagenes/Logo%20Social.png)](https://teenbiscuits.github.io/CronoSquare)

<div align="center">
<h3>🌐🎮 <a href="https://teenbiscuits.github.io/CronoSquare">CronoSquare: El Videojuego</a> 🎮🌐</h3>
</div>


<!--

ANTIGUO CONTADOR DE CUANTO QUEDA DE HACKUDC

<p align="center">
<a href="https://free.timeanddate.com/countdown/i98vzj1j/n681/cf100/cm0/cu4/ct0/cs0/ca0/co1/cr0/ss0/cac000/cpc000/pcfff/tcfff/fs150/szw448/szh189/tatCuanto%20queda%20de%20HackUDC%202024/tac000/tptSE%20ACAB%C3%93%20HACKUDC%202024/tpc000/iso2024-02-18T00:00:00">¿Cuanto queda de HackUDC?</a>
</p>

-->

# CronoSquare

<div align="center">

[![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?logo=HTML5&logoColor=white)]()
[![Build](https://github.com/TeenBiscuits/CronoSquare/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/TeenBiscuits/CronoSquare/actions/workflows/pages/pages-build-deployment)
[![Web](https://img.shields.io/website?down_message=offline&up_message=online&label=Web&url=https%3A%2F%2Fteenbiscuits.github.io%2FCronoSquare)](https://teenbiscuits.github.io/CronoSquare)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
</div>
 
**CronoSquare un pequeño minijuego de rompecabezas creado en HTML5 para la HackUDC 2024.**

### 💡 La Idea

![Windows Vista](https://raw.githubusercontent.com/TeenBiscuits/CronoSquare/main/imagenes/Windows-XP.webp)

En Windows Vista había un pequeño miniguego en el que nos inspiramos para crear este minijuego.

## 📷 Capturas de Pantalla

![Captura de pantalla-1](https://github.com/TeenBiscuits/CronoSquare/blob/main/imagenes/Captura%20de%20pantalla-1.png?raw=true)

![Captura de pantalla-2](https://github.com/TeenBiscuits/CronoSquare/blob/main/imagenes/Captura%20de%20pantalla-2.png?raw=true)

## 📖 Documentación

1. **Web Simple**. La estructura de la web es sencilla, consta de tres archivos: ```index.html```, ```script.js``` y ```style.css```.
2. **Sistema de generación de imágenes basado en IA**. El sistema original (no implementado devido a las limitaciones "Monetarias" que imponía la API) hace una llamada a la [API Stable Difusion](https://stablediffusionapi.com), que genera una imagen con un promp pseudo aleatorio (esta última parte no fue implementada porque descartamos la API al llegar al límite de request). Como solución temporal las imágenes fueron pre-generadas y guardadas en una carpeta del repo ```pics/```.
3. **Temporizador**. El juego no es solo un reto de habilidad sino también de tiempo.
4. **Nivel de ayuda**. No todos los jugadores están al mismo nivel, por eso se permite al jugador una pequeña ayuda opcional con la que ver la imagen original y/o unos pequeños números que usar como guía.
5. **Stats**. El jugador puede comprobar en todo momento su número de movimientos y es recompensado con **100 puntos** cada vez que completa correctamente un puzle.


## 💻 Contribuidores

- Pablo Portas López | [@TeenBiscuits](https://github.com/TeenBiscuits)
- Ángel Díaz Fernández | [@AngelDF00](https://github.com/AngelDF00)
- Alexandre Laredo Fernández | [@alex-ui](https://github.com/alex-ui)
