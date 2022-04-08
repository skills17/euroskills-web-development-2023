FROM php:8.0.7-apache

# install dependencies
RUN apt-get update \
    && apt-get install -y \
        git \
        libjpeg-dev \
        libmagickwand-dev \
        libpng-dev \
        zip \
        zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# install php extensions
RUN docker-php-ext-configure gd --with-jpeg=/usr/include/ \
    && docker-php-ext-install pcntl gd \
    && pecl install imagick \
    && docker-php-ext-enable imagick

# install composer
RUN curl https://getcomposer.org/installer > composer-setup.php \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && rm composer-setup.php

# configure apache
RUN a2enmod rewrite
