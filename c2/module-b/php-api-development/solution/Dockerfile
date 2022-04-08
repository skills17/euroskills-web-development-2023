FROM php:8.0.7-apache

# install dependencies
RUN apt-get update \
    && apt-get install -y \
        git \
        zip \
    && rm -rf /var/lib/apt/lists/*

# install php extensions
RUN docker-php-ext-install pdo pdo_mysql pcntl

# install composer
RUN curl https://getcomposer.org/installer > composer-setup.php \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && rm composer-setup.php

# configure apache
RUN a2enmod rewrite
