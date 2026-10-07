import requests
import warnings

from bs4 import BeautifulSoup
from urllib3.exceptions import InsecureRequestWarning


# We currently use verify=False because some scholarship
# websites have certificate problems.
warnings.simplefilter("ignore", InsecureRequestWarning)


def extract_webpage_text(url):
    """
    Fetch a webpage and extract readable scholarship text.
    Returns an empty string when the page does not contain
    useful content.
    """

    try:
        response = requests.get(
            url,
            timeout=15,
            verify=False,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 "
                    "(KHTML, like Gecko) "
                    "Chrome/142.0.0.0 Safari/537.36"
                )
            }
        )

        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Remove unnecessary elements
        for element in soup([
            "script",
            "style",
            "nav",
            "footer",
            "header",
            "noscript"
        ]):
            element.decompose()

        text = soup.get_text(
            separator=" ",
            strip=True
        )

        # Detect pages where the server returned an error page
        error_phrases = [
            "something went wrong",
            "please try again later",
            "page not found",
            "access denied",
            "service unavailable"
        ]

        lower_text = text.lower()

        for phrase in error_phrases:
            if phrase in lower_text:
                print(
                    f"Could not extract useful content from: {url}"
                )
                return ""

        # Very short pages are usually not useful scholarship pages
        if len(text) < 300:
            print(
                f"Could not extract enough content from: {url}"
            )
            return ""

        return text

    except requests.RequestException as e:
        print(f"Could not access webpage: {e}")
        return ""