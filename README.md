# Tracing Picasso

[https://ilokhov.github.io/picasso/](https://ilokhov.github.io/picasso/)

(only tested in Google Chrome)


## Background

This project was originally developed as part of the Coding Dürer Hackathon in Munich in 2017. The central problem tackled here is geographical and temporal mapping of artwork provenance.

The resulting data visualisation shows the locations of artworks over time. Showing where artworks were located at different times and mapping their movements allows to look for and analyse provenance patterns.


## Data

Several of Picasso's artworks are used as a dataset. It proved difficult to locate and extract full provenance data on artworks as this information is currently not publicly available. Textual data from the [Museum of Modern Art](https://www.moma.org/) and [Tate](http://www.tate.org.uk/) was therefore used instead to reconstruct the locations of artworks at particular times. The starting location of each artwork was determined by cross-referencing the known creation date with the records of where Picasso lived at various times throughout his life.


## Technical details

The following tools and libraries are used:

- [OpenStreetMap](https://www.openstreetmap.org) for map data
- [Mapbox](https://www.mapbox.com/) for styling the map
- [Leaflet.js](http://leafletjs.com/) for creating the layer on top of the map and manipulating objects

Object and location data is stored in JSON files. The script for showing and grouping particular objects and transactions was written specifically for this project.


## Future development ideas

- use a lighter alternative instead of the jQuery UI slider
- improve overall codebase, include a way to hold references to individual objects
- increase the amount of information displayed in the popup
- add a filter function (for example filter by different institutions)
- include more precise locations (addresses of museums instead of cities)
- include colour coding (for example for different types of transactions)
- improve animations
- check browser compatibility