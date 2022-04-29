# Index

## Define Indices
There are three sessions in defining an index:
* aliases: a way to represent index in an alternative name
* mappings: define data type
* settings: define specific configuration to the index

## Bulk Index Data
1. Get sample data from github
```bash
curl -O https://raw.githubusercontent.com/linuxacademy/content-elasticsearch-deep-dive/master/sample_data/accounts.json
curl -O https://raw.githubusercontent.com/linuxacademy/content-elasticsearch-deep-dive/master/sample_data/logs.json
curl -O https://raw.githubusercontent.com/linuxacademy/content-elasticsearch-deep-dive/master/sample_data/shakespeare.json
```

2. Ingest the sample data to es using the bulk API
```bash
curl -u elastic:helloworld -k -H 'Content-type: application/x-ndjson' -X POST https://localhost:9200/bank/_bulk --data-binary @accounts.json
curl -u elastic:helloworld -k -H 'Content-type: application/x-ndjson' -X POST https://localhost:9200/logs/_bulk --data-binary @logs.json
curl -u elastic:helloworld -k -H 'Content-type: application/x-ndjson' -X POST https://localhost:9200/shakespeare/_bulk --data-binary @shakespeare.json
```

3. Verify in kibana
```es
POST /bank/_refresh
POST /logs/_refresh
POST /shakespeare/_refresh

GET _cat/indices
```

## Perform CRUD operation
1. Query the document from the index by id
```es
GET bank/_doc/0
```
2. Create a new document
```es
PUT bank/_doc/1000
{
    "account_number" : 1000,
    "balance" : 28838,
    "firstname" : "Evan",
    "lastname" : "Chen",
    "age" : 36,
    "gender" : "M",
    "address" : "560 Kingsway Place",
    "employer" : "TPG",
    "email" : "ec@tpg.com",
    "city" : "Glebe",
    "state" : "NSW"
  }

GET bank/_doc/1000
``` 
3. Update the document
* modify the existing field
* add new field
```es
POST bank/_update/1000
{
  "doc":{
    "balance" : 1,
    "address" : "101 Mars",
    "favorite_color": "red"
  }
}
```

4. Delete
```es
DELETE bank/_doc/1000
```