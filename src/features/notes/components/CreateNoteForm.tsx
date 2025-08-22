import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../api/notesApi';
import type { NoteTags, Platform, Region, SkillLevel } from '../types';

interface FormInputs {
  title: string;
  body: string;
  game: string;
  platform: Platform;
  region: Region;
  skillLevel: SkillLevel;
  voice: boolean;
}

interface CreateNoteFormProps {
  onClose: () => void;
}

export const CreateNoteForm = ({ onClose }: CreateNoteFormProps) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
  
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = data => {
    const tags: NoteTags = {
      game: data.game,
      platform: data.platform,
      region: data.region,
      skillLevel: data.skillLevel,
      voice: data.voice,
    };

    createNoteMutation.mutate({
      title: data.title,
      body: data.body,
      tags: tags,
      author_username: 'GuestUser', // Hardcoded for now, replace with actual user data
    });
  };

  return (
    <div className="create-note-form-container">
      <h4>Create Post</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="create-note-form">
        <div className="form-field">
          <input {...register("title", { required: true })} placeholder="Title" className="title-input" />
          {errors.title && <span className="error">This field is required</span>}
        </div>

        <div className="form-field">
          <textarea {...register("body", { required: true })} placeholder="Body..." className="body-input" />
          {errors.body && <span className="error">This field is required</span>}
        </div>

        {/* Simple inputs for tags */}
        <select {...register("game", { required: true })}>
          <option value="">Select Game</option>
          <option value="Among Us">Among Us</option>
          <option value="Apex Legends">Apex Legends</option>
          <option value="Call of Duty">Call of Duty</option>
          <option value="Counter-Strike 2">Counter-Strike 2</option>
          <option value="Destiny 2">Destiny 2</option>
          <option value="Dota 2">Dota 2</option>
          <option value="Fall Guys">Fall Guys</option>
          <option value="FIFA">FIFA</option>
          <option value="Fortnite">Fortnite</option>
          <option value="Grand Theft Auto V">Grand Theft Auto V</option>
          <option value="League of Legends">League of Legends</option>
          <option value="Madden NFL">Madden NFL</option>
          <option value="Minecraft">Minecraft</option>
          <option value="NBA 2K">NBA 2K</option>
          <option value="Overwatch 2">Overwatch 2</option>
          <option value="Rainbow Six Siege">Rainbow Six Siege</option>
          <option value="Rocket League">Rocket League</option>
          <option value="Valorant">Valorant</option>
          <option value="Warzone">Warzone</option>
          <option value="World of Warcraft">World of Warcraft</option>
        </select>
        {errors.game && <span className="error">Please select a game</span>}

        <select {...register("platform", { required: true })}>
          <option value="">Select Platform</option>
          <option value="PC">PC</option>
          <option value="PlayStation">PlayStation</option>
          <option value="Xbox">Xbox</option>
          <option value="Nintendo">Nintendo</option>
          <option value="Mobile">Mobile</option>
        </select>
        {errors.platform && <span className="error">Please select a platform</span>}

        <select {...register("region", { required: true })}>
          <option value="">Select Region</option>
          <option value="NA-East">NA East</option>
          <option value="NA-West">NA West</option>
          <option value="EMEA">EMEA</option>
          <option value="Asia">Asia</option>
        </select>
        {errors.region && <span className="error">Please select a region</span>}

        <select {...register("skillLevel", { required: true })}>
          <option value="">Select Skill Level</option>
          <option value="Rookie">Rookie</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
          <option value="Platinum">Platinum</option>
          <option value="Diamond">Diamond</option>
          <option value="Master">Master</option>
          <option value="Pro">Pro</option>
        </select>
        {errors.skillLevel && <span className="error">Please select a skill level</span>}

        <label>
          <input type="checkbox" {...register("voice")} />
          Voice chat required
        </label>

        <button type="submit" disabled={createNoteMutation.isPending}>
          {createNoteMutation.isPending ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};
