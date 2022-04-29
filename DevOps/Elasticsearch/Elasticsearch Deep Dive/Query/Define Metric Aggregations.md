# Define Aggregations

## Metric Aggregations
Metric aggregation provide some calculation on numerical values

1: What is the average age of the account holders
```bash
# set `size=0` in the query to bypass the hit items and show the aggregation result straight away 
GET bank/_search
{
  "size": 0, 
  "aggs": {
    "you-know-who": {
      "avg": {
        "field": "age"
      }
    }
  }
}
```

```json
"hits" : {
    "total" : {
      "value" : 1000,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "you-know-who" : {
      "value" : 30.171
    }
  }
}
```

## Filter Aggregation
Apply filter to the query

1. How many account holders from CA
```bash
GET bank/_search
{
  "size": 0,
  "query": {
    "match": {
      "state.keyword" : "CA"
    }
  }, 
  "aggs": {
    "state": {
      "terms": {
        "field": "state.keyword",
        "size": 10
      }
    }
  }
}
```
```json
"buckets" : [
        {
          "key" : "CA",
          "doc_count" : 17
        }
      ]
```

2. How many account holders in CA with age between age 35 and 40. 
Use `bool` to nest the query condition
```bash
GET bank/_search
{
  "size": 0,
  "query": {
    "bool": {
      "must": [
        {"match": {
          "state.keyword": "CA"
        }},
        {"range": {
          "age": {
            "gte": 35,
            "lte": 40
          }
        }}
      ]
    }
  }, 
  "aggs": {
    "state": {
      "terms": {
        "field": "state.keyword",
        "size": 10
      }
    }
  }
}
```


## Bucket Aggregations
To aggregate the data and bucketize the result
1. How many account are there per state?
```bash
GET bank/_search
{
  "size": 0, 
  "aggs": {
    "you-know-who": {
      "terms": {
        "field": "state.keyword"
      }
    }
  }
}
```

```json
"aggregations" : {
    "you-know-who" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 743,
      "buckets" : [
        {
          "key" : "TX",
          "doc_count" : 30
        },
        {
          "key" : "MD",
          "doc_count" : 28
        },
        {
          "key" : "ID",
          "doc_count" : 27
        },
```

2. How many logs per day
```bash
GET logs/_search
{
  "size": 0,
  "aggs": {
    "you-know-whow": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "day"
      }
    }
  }
}
```

```json
{
 "aggregations" : {
    "you-know-whow" : {
      "buckets" : [
        {
          "key_as_string" : "2015-05-18T00:00:00.000Z",
          "key" : 1431907200000,
          "doc_count" : 9262
        },
        {
          "key_as_string" : "2015-05-19T00:00:00.000Z",
          "key" : 1431993600000,
          "doc_count" : 9248
        },
        {
          "key_as_string" : "2015-05-20T00:00:00.000Z",
          "key" : 1432080000000,
          "doc_count" : 9500
        }
      ]
    }
  }
}
```

## Sub-Aggregation or Nested-Aggregation
The sum of bytes for each extension
```bash
GET logs/_search
{
  "size": 0,
  "aggs": {
    "the extension": {
      "terms": {
        "field": "extension.keyword"
      },
      "aggs": {
        "sum of the bytes": {
          "sum": {
            "field": "bytes"
          }
        }
      }
    }
  }
}
```

```json
 "aggregations" : {
    "the extension" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "jpg",
          "doc_count" : 18330,
          "sum of the bytes" : {
            "value" : 1.02215668E8
          }
        },
        {
          "key" : "css",
          "doc_count" : 4506,
          "sum of the bytes" : {
            "value" : 2.4733012E7
          }
        },
        {
          "key" : "png",
          "doc_count" : 2606,
          "sum of the bytes" : {
            "value" : 2.6620342E7
          }
        },
        {
          "key" : "gif",
          "doc_count" : 1774,
          "sum of the bytes" : {
            "value" : 854140.0
          }
        },
        {
          "key" : "php",
          "doc_count" : 794,
          "sum of the bytes" : {
            "value" : 3885492.0
          }
        }
    }
 }
```

## Pipeline Aggregation
The aggregation that takes the input from the other aggregation 

* Parent: the input of the aggregation comes from the parent aggregation

The cumulative sum of unique clients per hour and the rate of change
```bash
GET logs/_search
{
  "size": 0,
  "aggs": {
    "hr": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "hour"
      },
      "aggs": {
        "clients": {
          "cardinality": {
            "field": "clientip.keyword"
          }
        },
        "sum_of_client":
        {
          "cumulative_sum": {
            "buckets_path": "clients"
          }
        },
        "client_per_minutes":
        {
          "derivative": {
            "buckets_path": "sum_of_client",
            "unit": "1m"
          }
        }
      }
    }
  }
}
```

```json
"aggregations" : {
    "hr" : {
      "buckets" : [
        {
          "key_as_string" : "2015-05-18T00:00:00.000Z",
          "key" : 1431907200000,
          "doc_count" : 10,
          "clients" : {
            "value" : 5
          },
          "sum_of_client" : {
            "value" : 5.0
          }
        },
        {
          "key_as_string" : "2015-05-18T01:00:00.000Z",
          "key" : 1431910800000,
          "doc_count" : 6,
          "clients" : {
            "value" : 3
          },
          "sum_of_client" : {
            "value" : 8.0
          },
          "client_per_minutes" : {
            "value" : 3.0,
            "normalized_value" : 0.05
          }
        },
        {
          "key_as_string" : "2015-05-18T02:00:00.000Z",
          "key" : 1431914400000,
          "doc_count" : 46,
          "clients" : {
            "value" : 23
          },
          "sum_of_client" : {
            "value" : 31.0
          },
          "client_per_minutes" : {
            "value" : 23.0,
            "normalized_value" : 0.38333333333333336
          }
        },
```

* Sibling
The aggregation is outside of the bucket. It is the sibling of the bucket

The hour when there have the most number of client
The `max_clients` and `min_client` aggregation are the sibling of the `hr` bucket

```bash
GET logs/_search
{
  "size": 0,
  "aggs": {
    "hr": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "hour"
      },
      "aggs": {
        "clients": {
          "cardinality": {
            "field": "clientip.keyword"
          }
        },
        "sum_of_client":
        {
          "cumulative_sum": {
            "buckets_path": "clients"
          }
        },
        "client_per_minutes":
        {
          "derivative": {
            "buckets_path": "clients",
            "unit": "1m"
          }
        }
      }
    },
    "max_clients": {
      "max_bucket": {
        "buckets_path": "hr>clients"
      }
    },
    "min_clients": {
      "min_bucket": {
        "buckets_path": "hr>clients"
      }
    }
  }
}
```

```json
 "max_clients" : {
      "value" : 429.0,
      "keys" : [
        "2015-05-20T11:00:00.000Z"
      ]
    },
    "min_clients" : {
      "value" : 1.0,
      "keys" : [
        "2015-05-18T23:00:00.000Z"
      ]
    }
```