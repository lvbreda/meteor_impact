#Impact

This script provides (basic atm) scaffolding for meteor. 
WORKS WITH THE AUTH BRANCH

##How does this magic work

    git clone https://github.com/lvbreda/meteor_impact.git 
    //create models like explained below
    node meteor_impact/create.js project path_to_models

##How to create a models

    {
        "posts" :{
            "title" : {"required" : true,"type" : "string","max" : "128","min":"2"},
            "description" : {"required":false,"type" : "string" , "max":"512"},
            "content" : {"required" : true, "type" : "string","max":"1000000"},
            "comments" : {"required":false,"type" :"subDocuments","subDocuments":{
                "name" : {"required" : true,"type":"string"},
                "text" : {"required" : true,"type":"string"}
            }}
        },
        "pages" :{
            "title" : {"required" : true,"type" : "string","max" : "128","min":"2"},
            "content" : {"required" : true, "type" : "string","max":"1000000"},
            "date" : {"required" : true, "type" : "date"},
            "likes" : {"required" : true, "type" : "number","min":"5","max":"1500"}
        }
    }
