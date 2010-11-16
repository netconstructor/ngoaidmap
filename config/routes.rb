Iom::Application.routes.draw do

  # Home
  root :to => "sites#home"

  # Session
  resource :session, :only => [:new, :create, :destroy]
  match 'login' => 'sessions#new', :as => :login
  match 'logout' => 'sessions#destroy', :as => :logout

  # Administration
  namespace :admin do
    match '/' => 'admin#index', :as => :admin
    resources :organizations do
      resources :media_resources, :only => [:index, :create, :destroy]
      resources :resources, :only => [:index, :create, :destroy]
    end
    resources :donors do
      resources :media_resources, :only => [:index, :create, :destroy]
      resources :resources, :only => [:index, :create, :destroy]
    end
  end

end
