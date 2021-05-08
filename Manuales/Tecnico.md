# Manual Técnico - RECICLAVID

A continuación se muestra una breve descripción de los distintos servicios utilizados, principalmente de Amazon Web Services.

## Amazon VPC

Para tener una capa extra de seguridad en nuestra infraestructura se decide hacer uso del servicio Amazon VPC.
El cual nos permite configurar una red, segun nuestras necesidades.


![VPC](/Images/Tecnico/vpc.png "VPC")

### Subredes

Para agregar una capa extra de seguridad se estaran manejando dos subredes, una privada y una publica.
En la privada se estara almacenando nuestro servidor, mientras que en la subred publica dejaremos nuestro frontend.


![Subnet](/Images/Tecnico/subnetprivada.png "Subnet")

Aca se muestran ambas subredes, ya creadas.

![Subnets](/Images/Tecnico/subredes.png "Subnets")

### Internet Gateway

Agregado a esto, se le creara su propio Intenet Gateway a nuestra VPC.

Esto para permitirle acceso a internet a nuestras subredes, se creará un internet gateway.


![InternetGateway](/Images/Tecnico/ig.png "InternetGateway")

### Route Table

Ademas se agregará una tabla de ruteo que nos sirve para poder manejar el trafico que permitiremos en nuestras subredes.

![RouteTable](/Images/Tecnico/rtpublica.png "RouteTable")

Por ejemplo, en nuestra tabla de ruteo publica, agregamos el trafico a internet, como se ve en la siguiente imagen.

![RouteTable](/Images/Tecnico/rts.png "RouteTable")

## Amazon EC2

Como se menciono anteriormente, se usaran maquinas virtuales para levantar tanto nuestro servidor (o backend), como tambien nuestro cliente (o frontend).

![EC2](/Images/Tecnico/ec2.png "EC2")