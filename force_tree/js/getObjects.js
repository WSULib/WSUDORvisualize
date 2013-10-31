//get objects

function getObjects(){

	var collection_PID = $('#collection_PID').val();    

	$(document).ready(function() {
        // test url
        dataObject = new Object();

        // dataObject.data_type = "xml2json";
        dataObject.data_type = "json";
        var baseURL = "http://silo.lib.wayne.edu/fedora/risearch?";
        var queryOptions = "type=tuples&lang=itql&format=json&dt=on&stream=on&query=";
        var baseQuery = "select $subject $object from <#ri> where walk($subject <fedora-rels-ext:isMemberOfCollection> <info:fedora/"+collection_PID+"> and $subject <fedora-rels-ext:isMemberOfCollection> $object);";
        dataObject.encodedQueryURL = baseURL + queryOptions + encodeURIComponent(baseQuery);        

		//returns json
        $(document).ready(function(){
          $.ajax({
            type: "POST",
            url: "php/ajax_tunnel.php",
            data: dataObject,
            dataType: "json",
            success: pull_meta
          });
        });

        function pull_meta(response){   
            console.log(response);
            globe_vars.jsonObject = response;

            //distill into nodes
            distilledObj = new Object();
            distilledObj.name = 'root_element';
            distilledObj.children = [];

            //node lists
            var levelone = [];                       

            for (var i = 0; i < globe_vars.jsonObject.results.length; ++i){
                var cObject = globe_vars.jsonObject.results[i].object;
                var cSubject = globe_vars.jsonObject.results[i].subject;

                //create 1st level nodes
                if ( $.inArray(cObject, levelone) == -1) {
                    levelone.push(cObject);                    
                    distilledObj.children[$.inArray(cObject, levelone)] = {};
                    distilledObj.children[$.inArray(cObject, levelone)].name = cObject
                    distilledObj.children[$.inArray(cObject, levelone)].children = [];                                        
                }
                else{
                    distilledObj.children[$.inArray(cObject, levelone)].children.push({name:cSubject,size:3000});
                }                
                
                
            }            
            
            // draw graph using json object
            initGraph(JSON.stringify(distilledObj));
        }

	});

    

}