
PUT my_first_index_1
{
    "aliases": {
        "my_first_index": {}
    },
    "mappings": {
        "properties": {
            "field_1": {
                "type": "keyword"
            },
            "field_2": {
                "properties": {
                    "field_2.1": {
                        "type": "integer"
                    },
                    "field_2.2": {
                        "type": "text"
                    }
                }
            }
        }
    },
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 1
    }
}


GET my_first_index_1
GET my_first_index


PUT my_first_index_2
{
    "aliases": {
        "my_first_index": {}
    },
    "mappings": {
        "properties": {
            "field_1": {
                "type": "keyword"
            },
            "field_2": {
                "properties": {
                    "field_2.1": {
                        "type": "integer"
                    },
                    "field_2.2": {
                        "type": "text"
                    }
                }
            }
        }
    },
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 1
    }
}


GET my_first_index_2
GET my_first_index

DELETE my_first_index_1
DELETE my_first_index_2