# == Schema Information
#
# Table name: media_resources
#
#  id                   :integer         not null, primary key
#  position             :integer         default(0)
#  element_id           :integer
#  element_type         :integer
#  picture_file_name    :string(255)
#  picture_content_type :string(255)
#  picture_filesize     :integer
#  picture_updated_at   :datetime
#  vimeo_url            :string(255)
#  vimeo_embed_html     :text
#  created_at           :datetime
#  updated_at           :datetime
#  caption              :string(255)
#

class MediaResource < ActiveRecord::Base

  acts_as_resource

  has_attached_file :picture, :styles => {
                                      :small => {
                                        :geometry => "80x46#",
                                        :quality => 90,
                                        :format => 'jpg'
                                      },
                                      :medium => {
                                        :geometry => "660x480#",
                                        :quality => 90,
                                        :format => 'jpg'
                                      }
                                    },
                            :url => "/system/:attachment/:id/:style.:extension"

  before_create :set_position

  validate :presence_of_picture_or_attachment

  def is_a_video?
    vimeo_url?
  end

  # http://vimeo.com/api/oembed.xml?url=http://vimeo.com/7100569
  def vimeo_url=(value)
    response = open("http://vimeo.com/api/oembed.xml?url=#{value}").read
    match = response.match(/<html>([^<]+)<\/html>/)
    html = match[1]
    html = html.gsub(/width=&quot;(\d+)&quot;/, 'width=&quot;549&quot;')
    html = html.gsub(/height=&quot;(\d+)&quot;/, 'height=&quot;300&quot;')
    write_attribute(:vimeo_url, value)
    write_attribute(:vimeo_embed_html, html)
  rescue URI::InvalidURIError
    errors[:base] << "You have upload a picture or indicate a Vimeo URL"
  end

  # decrement position
  def move_up
    return if self.position == 0
    return if self.class.count == 1
    upper_resource = self.class.where(["element_id = ? AND element_type = ? AND position < ?", element_id, element_type, position]).order('position DESC').first
    old_position = self.position
    self.position = upper_resource.position
    upper_resource.position = old_position
    upper_resource.save
  end

  # increment position
  def move_down
    return if self.class.count == 1
    if lower_resource = self.class.where(["element_id = ? AND element_type = ? AND position > ?", element_id, element_type, position]).order('position ASC').first
      old_position = self.position
      self.position = lower_resource.position
      lower_resource.position = old_position
      lower_resource.save
    end
  end

  private

    def set_position
      return if self.class.count == 0
      if last_resource_from_element = self.class.select("max(position) as position").where(:element_id => self.element_id, :element_type => self.element_type).first.position
        self.position = last_resource_from_element + 1
      else
        self.position = 0
      end
    end

    def presence_of_picture_or_attachment
      if vimeo_url.blank? && picture_file_name.blank?
        errors[:base] << "You have upload a picture or indicate a Vimeo URL"
      end
    end

end
