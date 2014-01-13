// Requires
var cheerio = require( 'cheerio' ),
    request = require( 'request' ),
    nodemailer = require( 'nodemailer' );

// Config
var config = require( 'config' );

// Start the music //////////////////////////////////////

CheckRefurb();

/////////////////////////////////////////////////////////
// Functions ////////////////////////////////////////////
/////////////////////////////////////////////////////////

function CheckRefurb () {
    // Read in the url
    GetUrl( config.path, function ( body, response ) {
        var $ = cheerio.load( body ),
            found = [];

        $('.product h3').each( function () {
            var title = $(this).text().trim(),
                search = new RegExp( config.search, 'gi' );

            if ( search.test( title ) ) {
                found.push( title );
            }
        });

        // If we found anything, send an alert
        if ( found.length ) {
            SendEmail({
                from: config.mail.from,
                to: config.mail.to,
                subject: 'Apple Refurbished Product Alert',
                body: 'New products found on Apple Refurbished:\n' + found.join( ',\n' )
            });

            if ( config.debug ) console.log( found );
        } else {
            if ( config.debug ) console.log( 'Nothing found.' );
        }

        // Idle, then check again
        Idle( config.refresh_interval, function () {
            CheckRefurb();
        });
    });
}

function GetUrl ( url, callback ) {
    request( url, function ( error, response, body ) {
        if ( error ) throw error;

        if ( response.statusCode == 200 ) {
            callback( body, response );
        }
    });
}

function SendEmail ( args ) {
    // Set email up
    var smtpTransport = nodemailer.createTransport( "SMTP", {
        service: "Gmail",
        auth: {
            user: config.mail.user,
            pass: config.mail.pass
        }
    });

    var mailOptions = {
        from: "Apple Refurb Monitor <" + args.from + ">",
        to: args.to,
        subject: args.subject,
        text: args.body
    };

    // send mail with defined transport object
    smtpTransport.sendMail( mailOptions, function( error, response ) {
        if ( error ) {
            if ( config.debug ) console.log(error);
        } else {
            if ( config.debug ) console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
    });

    /*var msg = new email({ 
        from: args.from,
        to: args.to,
        subject: args.subject,
        body: args.body
    });

    msg.send( function( err ){
        if ( config.debug ) console.log( 'Unable to send email: ', err );
    });*/
}

// Wait the specified period.  Will call finished upon completion.
function Idle ( period, finished ) {
    if ( config.debug ) console.log( 'Idling for ' + period + ' minutes.' );

    setTimeout( function () {
        finished();
    }, period * 60 * 1000 );
}
