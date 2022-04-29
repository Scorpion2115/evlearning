# Execute Analyzed Search Queries

The analyze API tokenize the text.
```es
GET _analyze
{
  "analyzer": "english",
  "text": "The king is a lord"
}
```

```json
 {
  "tokens" : [
    {
      "token" : "king",
      "start_offset" : 4,
      "end_offset" : 8,
      "type" : "<ALPHANUM>",
      "position" : 1
    },
    {
      "token" : "lord",
      "start_offset" : 14,
      "end_offset" : 18,
      "type" : "<ALPHANUM>",
      "position" : 4
    }
  ]
}

```


1. Use `match` to search on a token basis
```es
# return all contents contains "King"
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": "King lord"
    }
  }
}
```
There are `3984` results contains both `king` and `lord`, the maximum relevance score is `10.362949`
```json
 "hits" : {
    "total" : {
      "value" : 3984,
      "relation" : "eq"
    },
    "max_score" : 10.362949,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_type" : "_doc",
        "_id" : "109280",
        "_score" : 10.362949,
        "_source" : {
          "type" : "line",
          "line_id" : 109281,
          "play_name" : "A Winters Tale",
          "speech_number" : 26,
          "line_number" : "3.2.151",
          "speaker" : "Servant",
          "text_entry" : "My lord the king, the king!"
        }
      },
      {
        "_index" : "shakespeare",
        "_type" : "_doc",
        "_id" : "80142",
        "_score" : 9.061725,
        "_source" : {
          "type" : "line",
          "line_id" : 80143,
          "play_name" : "Richard II",
          "speech_number" : 16,
          "line_number" : "3.3.103",
          "speaker" : "NORTHUMBERLAND",
          "text_entry" : "The king of heaven forbid our lord the king"
        }
      },
      {
        "_index" : "shakespeare",
        "_type" : "_doc",
        "_id" : "32830",
        "_score" : 8.767382,
        "_source" : {
          "type" : "line",
          "line_id" : 32831,
          "play_name" : "Hamlet",
          "speech_number" : 39,
          "line_number" : "1.2.194",
          "speaker" : "HORATIO",
          "text_entry" : "My lord, the king your father."
        }
      },

```

2. Use `match_phrase` to search phrase
```es
GET shakespeare/_search
{
  "query": {
    "match_phrase": {
      "text_entry": "my lord"
    }
  }
}
```

```json
"hits" : {
    "total" : {
      "value" : 1568,
      "relation" : "eq"
    },
    "max_score" : 9.603244,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_type" : "_doc",
        "_id" : "41504",
        "_score" : 9.603244,
        "_source" : {
          "type" : "line",
          "line_id" : 41505,
          "play_name" : "Henry VIII",
          "speech_number" : 18,
          "line_number" : "2.4.113",
          "speaker" : "QUEEN KATHARINE",
          "text_entry" : "My lord, my lord,"
        }
      },
      {
        "_index" : "shakespeare",
        "_type" : "_doc",
        "_id" : "71460",
        "_score" : 9.603244,
        "_source" : {
          "type" : "line",
          "line_id" : 71461,
          "play_name" : "Much Ado about nothing",
          "speech_number" : 22,
          "line_number" : "5.1.80",
          "speaker" : "LEONATO",
          "text_entry" : "My lord, my lord,"
        }
      },
```
