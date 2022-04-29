# Execute Non-Analyzed Search Queries
Non-analyzed search queries is a term level query. The query itself and the data will not ben analyzed in any way. It is a basic character by character search
```es
# search all
GET bank/_search

# limit the hits array to 1
GET bank/_search?size=1
```

Only the `keyword` field type is eligible for a non-analyzed search. 
```es
GET bank


 "state" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        }
```


* Single term
```es
GET bank/_search
{
  "query": {
    "term": {
      "state.keyword": {
        "value": "CO"
      }
    }
  }
}
```

* Multi-terms
```es
GET bank/_search
{
  "size": 20, 
  "query": {
    "terms": {
      "state.keyword":[
        "CO","PA"] 
    }
  }
}
```