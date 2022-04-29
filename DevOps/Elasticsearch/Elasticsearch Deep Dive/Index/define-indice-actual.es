// Index one, use dynamic mappings
PUT bank 
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  }
}

GET bank
DELETE bank

// Index two, apply explicity mapping on some specific fields
PUT shakespeare
{
  "mappings": {
    "properties": {
      "speaker": {"type": "keyword"},
      "play_name": {"type": "keyword"},
      "line_id": {"type": "integer"},
      "speech_number": {"type": "integer"}
    }
  },
   "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 1
    }
}

GET shakespeare

// Index three, use nested properties for geospatial data
PUT logs 
{
  "mappings": {
    "properties": {
      "geo": {
        "properties": {
          "coordinates": {"type": "geo_point"}
        }
      }
    }
  },
     "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 1
    }
}

GET logs