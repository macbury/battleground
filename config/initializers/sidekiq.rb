require 'sidekiq/web'

Sidekiq::Web.use Rack::Auth::Basic do |username, password|
  username == 'admin' && password == ENV.fetch('SIDEKIQ_BASIC_AUTH_PASSWORD')
end

Sidekiq.default_worker_options = { backtrace: true, retry: 25, dead: false }

Sidekiq.configure_server do |config|
  config.redis = ConnectionPool.new(size: job_count + 5, timeout: 5) do 
    Redis.new(url: ENV.fetch('REDIS_URL'))
  end

  config = ActiveRecord::Base.configurations[Rails.env] || Rails.application.config.database_configuration[Rails.env]
  config['pool'] = job_count + 1
  
  ActiveRecord::Base.establish_connection(config)
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV.fetch('REDIS_URL') }
end
