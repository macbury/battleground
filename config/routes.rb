require 'sidekiq/web'

Rails.application.routes.draw do
  mount Sidekiq::Web => '/workers'
  root 'frontend#show'
  match '*path' => 'frontend#show', via: [:get]
end
