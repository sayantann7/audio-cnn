import base64
import io
import modal
import numpy as np
import torch.nn as nn
import torchaudio.transforms as T
import torch
from pydantic import BaseModel
import soundfile as sf
import librosa

from model import AudioCNN

