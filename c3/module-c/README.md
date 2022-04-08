# C3 - CMS

Content Management System

In this test project, we want to setup a Wordpress CMS website to promote concerts in Graz.

We use the `we-are-the-youth` theme. Based on that, we want to have some modifications to fit the brand.

## Competitor Information

The CMS has to be available at `http://<hostname>/module-c`.

## Theme Customization

We want to customize the theme as follows.

### Colors

In the theme setting, the headline color for both post list and post page should be #336699.
The link color should also be #336699.
The "byline" color in the theme should be #fab526.

The default typography also do not fit the branding, please use the font provided below.

### Font

Please set the entire website to use Verdana font with fallback to sans-serif. The letter-spacing should be -1px.

### Background image

Please change the theme background image to the one provided for Graz.


## Disabling pin-to-top post

The client does not want their staff to pin post to top. Please disable this feature for all posts in the installed Wordpress instance.

## Custom banner type

The client wants to have some links with a thumbnail banner defined. Please create a custom type for this format:

- Title
- Website URL to link to
- Thumbnail image

The banners should appear in the side bar. There are no particular requirements on the order of the banners.

Please add a proper alternative text to the generated thumbnail.

## Post categories creation

Please create the following categories for posting articles:

- News
- Promotions
- Miscellaneous

Please make sure to remove the default Uncategorized category.

## Example posts

For each post category, create at least one example post, so that the correct functionality of the webpage can be tested.

## Menu items

This site is mainly for displaying news of the event. Here is the menu setup, in exact order and wordings.

- Home
- News
- Promotions
- Misc.

The Home links to the root URL, which shows all the posts from all the categories.
The News shows only posts from News category.
The Promotes shows only posts from Promotes category.
The Misc. shows only posts from Miscellaneous category.

All posts listing are in reverse chronological order (newest to oldest).



## Login page customization

We want the CMS login page to be white-label.
That means the login page should not show the CMS default Wordpress logo.


## Admin area

We want to have one custom page in the admin area.
This page is called "About".
This is a static page and available in the side bar menu.
This link should be at the top of the side bar, before the default "Dashboard" link.


The purpose of this about page is to provide developer information so that when any staff from our client has questions when using the WordPress system, they know where to ask for help.

We want the following content and elements in the about page.

- A heading with the text "About the system"
- The development team name: Example Studio
- A contact email linked to "developer@example.com"


In order to make the code maintainable and have separation of concern, we want the HTML of the about page to be placed in a dedicated file.

Please make sure the about page looks elegant, minimal, and professional to show that the development team behind this site is a professional team.


## User creation

Please create the following user data.

The Admin user - access to the complete WordPress main dashboard.
	Username: admin
	Password: admin

The Editor user – access as editor role in the CMS.
	Username: editor
	Password: editor
