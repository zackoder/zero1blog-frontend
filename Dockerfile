# ---- Stage 1: Development container for Angular ----
FROM node:20

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install Angular CLI and dependencies
RUN npm install -g @angular/cli && npm install

# Copy the rest of the source code
COPY . .

# Expose Angular default dev port
EXPOSE 4200

# Start Angular app
CMD ["ng", "serve", "--host", "0.0.0.0"]
