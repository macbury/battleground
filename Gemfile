source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.5.0'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.2.1'
# Use postgresql as the database for Active Record
gem 'pg', '>= 0.18', '< 2.0'
# Use Puma as the app server
gem 'puma', '~> 3.11'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker'
gem 'pry-rails'
gem 'dotenv-rails'
gem 'pry'
gem 'jbuilder'
gem 'dry-transaction'
gem 'dry-auto_inject'
gem 'dry-validation'
gem 'bootsnap', '>= 1.1.0', require: false
gem 'devise-jwt', '~> 0.5.7'
gem 'sidekiq'
gem 'dotenv-rails'

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
# gem 'rack-cors'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

group :development do
  gem 'listen', '>= 3.0.5', '< 3.2'
end

group :test do
  gem 'webmock'
  gem 'vcr'
  gem 'rspec-sidekiq'
  gem 'factory_bot', '~> 4.10'
  gem 'shoulda-matchers', require: 'shoulda/matchers'
  gem 'database_cleaner', '~> 1.7'
  gem 'timecop'
end


# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
