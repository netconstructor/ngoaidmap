class Admin::PagesController < ApplicationController

  before_filter :login_required, :set_site

  def index
    @pages = @site.pages.highlighted.paginate :per_page => 20, :order => 'created_at DESC', :page => params[:page]
  end

  def new
    @page = @site.pages.new
  end

  def create
    @page = @site.pages.new(params[:page])
    if @page.save
      redirect_to edit_admin_site_page_path(@site, @page), :flash => {:success => 'Page has been created successfully'}
    else
      render :action => 'new'
    end
  end

  def edit
    @page = @site.pages.from_param(params[:id])
  end

  def update
    @page = @site.pages.find_by_permalink(params[:id])

    if @page.update_attributes(params[:page])
      redirect_to edit_admin_site_page_path(@site, @page), :flash => {:success => 'Page has been updated successfully'}
    else
      render :action => 'edit'
    end
  end

  def destroy
    @page = @site.pages.find(params[:id])
    @page.destroy
    redirect_to admin_site_pages_path(@site), :flash => {:success => 'Page has been deleted successfully'}
  end

  protected

    def set_site
      @site = Site.find(params[:site_id])
    end

end
