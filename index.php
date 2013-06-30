<!DOCTYPE html>
<html lang="en" xmlns:og="http://ogp.me/ns#" xmlns:fb="http://www.facebook.com/2008/fbml">

<head profile="http://gmpg.org/xfn/11">
<meta charset="utf-8" />
<title>Your Music, Your Style :: Wardrobe.FM</title>
<meta name="description" content="Wardrobe.FM: Your music, your style" />

<link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="style.css" />

</head>
<body>
	<section id="container">
		<nav id="menu">
			<ul>
				<li><a href="#" title="About Wardrobe.FM">About</a></li>
				<li class="last"><a href="#" title="Get help">Help</a></li>
			</ul>
		</nav>
		<header id="header">
			<h1>Wardrobe.FM</h1>
			<div id="search">
				<form id="searchform" name="searchform" method="POST" action="/url">
					<fieldset>
						<input type="text" name="s" placeholder="Search for a band, album, or song" autocomplete="off" autofocus="autofocus" />
						<button type="submit">Search</button>
					</fieldset>
					<!-- submit button -->
				</form>
			</div>
		</header>	
	</section>
	<section id="resultscontainer">
		<div id="results">
			<div id="resultsLeft">
				<div id="lastfmdata"><ul></ul></div>
			</div>
			<div id="resultsRight">
				<div>
					<div id="resultsheading"><h2></h2></div>
					<div id="resultsbio"><p></p></div>
					<div id="resultstours"><p></p></div>
				</div>
			</div>
		</div>
	</section>
		<!-- JS at the bottom for load speed -->
	<script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
	<script src="http://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
	<script src="js/wardrobefm.js"></script>
</body>
</html>