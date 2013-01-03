$(function() {
    var $player = $('#pop-audio');
    var $title = $('h1');
    var $transcript = $('#transcript');

    // Setup jplayer
    $player.jPlayer({
        ended: function (event) {
            $(this).jPlayer("pause");
        },
        swfPath: "js",
        supplied: "mp3"
    });

    // Setup popcorn
    pop = Popcorn('#jp_audio_0');

	function init() {
        /*
         * Fetch the transcript json and render it.
         */
		$.getJSON('transcript.json', function(transcript) {
            $title.text(transcript['title']);

            $player.jPlayer('setMedia', {
                mp3: transcript['mp3_url'] 
            }).jPlayer("pause");

			$.each(transcript['turns'], function(k, turn) {
                var speaker = transcript['speakers'][turn['speaker_id']];

                $.each(turn['fragments'], function(k2, fragment) {
                    var html = JST.fragment($.extend({}, fragment, { 'speaker': speaker }));
                    var $fragment = $(html).appendTo($transcript);

                    pop.code({
                        start: fragment['offset'],
                        end: fragment['offset'] + .5,
                        onStart: function( options ) {         
                            $('#transcript li').css('background-color', '#fff');
                            $fragment.css('background-color', '#fcc');

                            return false;
                        } 
                    });
                });
			});

            $transcript.find('li').click(function() {
                var offset = $(this).data('offset');

                $player.jPlayer('play', offset);
            });
        });
	}

    init();
});
