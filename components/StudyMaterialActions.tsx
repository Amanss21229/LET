"use client";


type Props = {

  downloadUrl:
    string | null;

};


export default function StudyMaterialActions({

  downloadUrl,

}: Props) {


  const handleShare =
    async () => {


      const shareUrl =
        window.location.href;


      try {


        if (
          navigator.share
        ) {


          await navigator.share({

            title:
              document.title,

            text:
              "Check out this study material.",

            url:
              shareUrl,

          });


          return;

        }


        await navigator.clipboard.writeText(

          shareUrl

        );


        alert(

          "Study material page link copied!"

        );


      }

      catch (

        error

      ) {


        console.error(

          "Unable to share study material:",

          error

        );

      }

    };


  return (

    <div className="study-material-actions">


      {downloadUrl ? (

        <a

          href={
            downloadUrl
          }

          target="_blank"

          rel="noopener noreferrer"

          className="btn primary"

        >

          ⬇️ Download


        </a>

      ) : (

        <button

          className="btn"

          disabled

        >

          Download Unavailable

        </button>

      )}


      <button

        className="btn"

        onClick={
          handleShare
        }

      >

        🔗 Share


      </button>


    </div>

  );

}
