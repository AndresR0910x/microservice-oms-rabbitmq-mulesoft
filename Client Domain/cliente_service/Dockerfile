# Usa una imagen base de Java
FROM openjdk:22-jdk-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo JAR compilado
COPY target/cliente_service-0.0.1-SNAPSHOT.jar /app.jar

# Expone el puerto (definido por variable de entorno)
EXPOSE 8083

# Ejecuta la aplicación
ENTRYPOINT ["java", "-jar", "/app.jar"]