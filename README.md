Creation of an online compiler where backend is in express

> Initilization
> Will send code and language from client to server using Post request - req.body
> Server will parse req.body and retrieve the data
> Using fs, we will create folder and unique filename and save it in local
> using generateFile module which accepts language and code and retuens filepath

> Use child process - exec to execute the cpp code and generate output in output file
> using executeCpp funtion to run file and send response
> Send back the o/p back to client as a response
> Send filepath and o/p as reponse
