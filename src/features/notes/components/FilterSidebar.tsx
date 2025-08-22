
import type { NoteFilters } from '../types';

interface FilterSidebarProps {
  filters: NoteFilters;
  setFilters: React.Dispatch<React.SetStateAction<NoteFilters>>;
  sort: 'new' | 'active' | 'hot';
  setSort: React.Dispatch<React.SetStateAction<'new' | 'active' | 'hot'>>;
}

export const FilterSidebar = ({ setFilters, setSort, sort, filters }: FilterSidebarProps) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value === 'all' ? undefined : value }));
  };

  return (
    <aside className="sidebar">
      <h3>Sort & Filter</h3>
      <div className="control-group">
        <label>Sort By</label>
        <div className="button-group">
          <button onClick={() => setSort('active')} className={sort === 'active' ? 'active' : ''}>Active</button>
          <button onClick={() => setSort('new')} className={sort === 'new' ? 'active' : ''}>New</button>
          <button onClick={() => setSort('hot')} className={sort === 'hot' ? 'active' : ''} disabled>Hot</button>
        </div>
      </div>
      <div className="control-group">
        <label htmlFor="game">Game</label>
        <select id="game" name="game" onChange={handleFilterChange} value={filters.game || 'all'}>
          <option value="all">All Games</option>
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
      </div>
      <div className="control-group">
        <label htmlFor="platform">Platform</label>
        <select id="platform" name="platform" onChange={handleFilterChange} value={filters.platform || 'all'}>
          <option value="all">All Platforms</option>
          <option value="PC">PC</option>
          <option value="PlayStation">PlayStation</option>
          <option value="Xbox">Xbox</option>
          <option value="Nintendo">Nintendo</option>
          <option value="Mobile">Mobile</option>
        </select>
      </div>
      <div className="control-group">
        <label htmlFor="skillLevel">Skill Level</label>
        <select id="skillLevel" name="skillLevel" onChange={handleFilterChange} value={filters.skillLevel || 'all'}>
          <option value="all">All Skill Levels</option>
          <option value="Rookie">Rookie</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
          <option value="Platinum">Platinum</option>
          <option value="Diamond">Diamond</option>
          <option value="Master">Master</option>
          <option value="Pro">Pro</option>
        </select>
      </div>
    </aside>
  );
};