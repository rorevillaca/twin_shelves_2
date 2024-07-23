export function ParsePolygons(data, wallContainerAttrs, wallWidth, wallHeight) {
    //Parses the data of the polygons, converting it from relative to absolute
    const result = {};
  
    data.forEach(item => {
      if (!result[item.topic]) {
        result[item.topic] = [];
      }
      result[item.topic].push(`${item.x_perc*wallWidth},
        ${item.y_perc*wallHeight + (wallContainerAttrs.height-wallHeight)/2}`);
    });
  
    const transformedData = Object.keys(result).map(topic => ({
      topic,
      points: result[topic].join(' ')
    }));
  
    return transformedData;
}
  