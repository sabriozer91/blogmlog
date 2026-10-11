#!/bin/sh
# Yerel önizleme: http://localhost:4000 — dosya kaydedilince sayfa kendiliğinden yenilenir.
# Jekyll sistem Ruby'sine değil, bu klasördeki vendor/ altına kuruludur. İlk kurulum için:
#   GEM_HOME=vendor/gems gem install bundler -v 2.4.22
#   GEM_HOME=vendor/gems vendor/gems/bin/bundle config set --local path vendor/bundle
#   GEM_HOME=vendor/gems vendor/gems/bin/bundle install
cd "$(dirname "$0")" || exit 1
export GEM_HOME="$PWD/vendor/gems" GEM_PATH="$PWD/vendor/gems"
exec "$GEM_HOME/bin/bundle" exec jekyll serve --livereload "$@"
