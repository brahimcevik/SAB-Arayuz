import logging
from colorama import Fore, Style, init
import coloredlogs

init(autoreset=True)

class ColorFormatter(logging.Formatter):
    FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    LEVEL_COLORS = {
        logging.DEBUG: Fore.CYAN,
        logging.INFO: Fore.GREEN,
        logging.WARNING: Fore.YELLOW,
        logging.ERROR: Fore.RED,
        logging.CRITICAL: Fore.MAGENTA,
    }

    def format(self, record):
        log_color = self.LEVEL_COLORS.get(record.levelno, Fore.WHITE)
        log_message = super().format(record)
        return f"{log_color}{log_message}{Style.RESET_ALL}"

def get_colored_logger():
    logger = logging.getLogger('ColoredLogger')
    coloredlogs.install(
        level='DEBUG',
        logger=logger,
        fmt='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    return logger
