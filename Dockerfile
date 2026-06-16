# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM maven:3.9-eclipse-temurin-17-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/pom.xml ./
COPY backend/src ./src
# Copy built frontend static files into Spring Boot static resources
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static
RUN mvn package -DskipTests

# Stage 3: Final runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/target/*.jar app.jar
ENV PORT=8080
EXPOSE 8080
CMD ["sh", "-c", "java -jar app.jar"]
