# Router
```bash
GET collector4-telegraf-2022.03.31/_search
{
  "size": 0,
  "query": {
    "match": {
      "tag.port_id" : "1/1/11"
    }
  }, 
  "aggs": {
    "per minute": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "minute"
      },
      "aggs": {
        "port_out_byte": {
          "sum": {
            "field": "port-traffic.out_octets"
          }
        },
        "port_out_bits":
        {
          "bucket_script": {
            "buckets_path": {"bytes":"port_out_byte"},
            "script": "params.bytes * 8"
          }
        },
        "cumulative_sum_of_out_bits":
        {
          "cumulative_sum": {
            "buckets_path": "port_out_bits"
          }
        },
        "bps":
        {
          "derivative": {
            "buckets_path": "cumulative_sum_of_out_bits",
            "unit": "1s"
          }
        }
      }
    }
  }
}
```

```bash
GET collector4-telegraf-2022.03.31/_search
{
  "size": 0,
  "query": {
    "match": {
      "tag.port_id" : "1/1/11"
    }
  }, 
 "aggs": {
   "per minute": {
     "date_histogram": {
       "field": "@timestamp",
       "calendar_interval": "minute"
     },
     "aggs": {
       "port_speed": {
         "sum": {
           "field": "port-traffic.oper_speed"
         }
       },
       "port_traffic":{
         "sum": {
           "field": "port-traffic.out_octets"
         }
       },
       "utlization rate":
       {
         "bucket_script": {
           "buckets_path": {
             "n": "port_speed",
             "d": "port_traffic"
           },
           "script": "100 * params.n / params.d"
         }
       }
     }
   }
 }
}
```