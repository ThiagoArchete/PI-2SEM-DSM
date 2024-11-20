CREATE DATABASE banco_dados;
use banco_dados;

CREATE TABLE usuarios (
	id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(45) NOT NULL,
    nome_completo VARCHAR(100) NOT NULL,
    senha VARCHAR(100) NOT NULL
);

CREATE TABLE quadros (
    id_quadro INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    prioridade ENUM('Baixa', 'Média', 'Alta') NOT NULL,
    prazo DATE NOT NULL,
    coluna ENUM('1', '2', '3', '4') NOT NULL,
    id_quadro INT,
    FOREIGN KEY (id_quadro) REFERENCES quadros(id_quadro)
);

